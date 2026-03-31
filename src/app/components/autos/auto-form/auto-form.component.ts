import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Agencia } from '../../../model/agencia';
import { Auto } from '../../../model/auto';
import { AutoService } from '../../../services/autoService';
import { AgenciaService } from '../../../services/agenciaService';

@Component({
  selector: 'app-auto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auto-form.html',
  styleUrl: './auto-form.css',
})
export class AutoForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  autoId!: number;
  agencias: Agencia[] = [];
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  imagenPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private autoService: AutoService,
    private agenciaService: AgenciaService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      color: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      placa: ['', Validators.required],
      imagen: [null],
      agencia: this.fb.group({
        idagencia: [null, Validators.required],
      }),
    });
    this.cargarAgencias();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.autoId = +id;
      this.cargarAuto();
    }
  }

  cargarAgencias(): void {
    this.agenciaService.consultarAgencias().subscribe({
      next: (res: any) => {
        const data = res?.object;
        this.agencias = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
    });
  }

  cargarAuto(): void {
    this.loading = true;
    this.autoService.getAutoById(this.autoId).subscribe({
      next: (res: any) => {
        const auto = res?.object as Auto;
        if (auto) {
          this.form.patchValue({
            ...auto,
            agencia: { idagencia: auto.agencia?.idagencia },
          });
          if (auto.imagen) {
            this.imagenPreview = auto.imagen;
          }
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showMessage('Error al cargar auto', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      this.showMessage('La imagen no debe superar 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.imagenPreview = base64;
      this.form.patchValue({ imagen: base64 });
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  quitarImagen(): void {
    this.imagenPreview = null;
    this.form.patchValue({ imagen: null });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const data: Auto = this.form.value;
    const op = this.isEdit
      ? this.autoService.editarAuto(this.autoId, data)
      : this.autoService.crearAuto(data);

    op.subscribe({
      next: () => {
        this.showMessage(
          this.isEdit ? 'Auto actualizado correctamente' : 'Auto creado correctamente',
          'success',
        );
        this.submitting = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/autos']), 1500);
      },
      error: () => {
        this.showMessage('Error al guardar auto', 'error');
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3500);
  }
}
