import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgenciaService } from '../../../services/agenciaService';
import { Agencia } from '../../../model/agencia';

@Component({
  selector: 'app-agencia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './agencia-form.html',
  styleUrl: './agencia-form.css',
})
export class AgenciaForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  agenciaId!: number;
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private agenciaService: AgenciaService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre:    ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', Validators.required],
      telefono:  ['', Validators.required],
      ciudad:    ['', Validators.required],
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.agenciaId = +id;
      this.cargarAgencia();
    }
  }

  cargarAgencia(): void {
    this.loading = true;
    this.agenciaService.getAgenciaById(this.agenciaId).subscribe({
      next: (res) => {
        const data = res?.object as Agencia;
        if (data) this.form.patchValue(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showMessage('Error al cargar agencia', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const data: Agencia = this.form.value;
    const op = this.isEdit
      ? this.agenciaService.actualizarAgencia(this.agenciaId, data)
      : this.agenciaService.crearAgencia(data);

    op.subscribe({
      next: (res) => {
        this.showMessage(
          this.isEdit ? 'Agencia actualizada correctamente' : 'Agencia creada correctamente',
          'success'
        );
        this.submitting = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/agencias']), 1500);
      },
      error: () => {
        this.showMessage('Error al guardar agencia', 'error');
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  get f() { return this.form.controls; }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 3500);
  }
}