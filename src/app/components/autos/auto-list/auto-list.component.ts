import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AutoService } from '../../../services/autoService';
import { Auto } from '../../../model/auto';
import { Agencia } from '../../../model/agencia';
import { AgenciaService } from '../../../services/agenciaService';

@Component({
  selector: 'app-auto-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './auto-list.html',
  styleUrl: './auto-list.css',
})
export class AutoList implements OnInit {
  autos: Auto[] = [];
  currentPage: number =0;
  pageSize: number = 6;
  totalPage: number = 0;
  todosLosAutos: Auto[] = [];
  marcasDisponibles: String[] = [];
  agencias: Agencia[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  deleteTarget: Auto | null = null;
  filterMarca = '';
  filterAgenciaId: number | null = null;
  precioMin: number | null = null;
  precioMax: number | null = null;
  activeFilter = '';

  constructor(
    private autoService: AutoService,
    private agenciaService: AgenciaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAutos();
    this.cargarAgencias();
  }


  cargarAgencias(): void{
    this.agenciaService.consultarAgencias().subscribe({
      next:(res: any) => {
        const data = res?.object;
        this.agencias = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      }

    });

  }

  cargarAutos(): void {
  this.loading = true;
  this.autoService.consultarAutos(this.currentPage, this.pageSize).subscribe({
    next: (res: any) => {
      const pageData = res?.object; 
      this.todosLosAutos = Array.isArray(pageData?.content) ? pageData.content : [];
      this.autos = [...this.todosLosAutos];

      console.log('Response completo:', res);

      this.marcasDisponibles = [
        ...new Set(this.todosLosAutos.map(a => a.marca).filter(Boolean))
      ].sort();

      this.totalPage = pageData?.totalPages ?? 0;

      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.showMessage('Error al cargar autos', 'error');
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

cambiarPagina(page: number): void {
  if (page >= 0 && page < this.totalPage) {
    this.currentPage = page;
    this.cargarAutos();
  }
}


  buscarPorMarca(): void {
    if(!this.filterMarca){
      this.autos = [...this.todosLosAutos];
      this.activeFilter = '';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.activeFilter = 'marca';
    this.autoService.consutarPorMarca(this.filterMarca.trim()).subscribe({
      next: (res: any) => {
        const data = res?.object;
        this.autos = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showMessage('Error al buscar por marca', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarPorAgencia(): void {
    if (!this.filterAgenciaId) return;
    this.loading = true;
    this.activeFilter = 'agencia';
    this.autoService.consultarPorAgencias(this.filterAgenciaId).subscribe({
      next: (res: any) => {
        const data = res?.object;
        this.autos = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showMessage('Error al buscar por agencia', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarPorPrecio(): void {
    if (this.precioMin === null || this.precioMax === null) return;
    this.loading = true;
    this.activeFilter = 'precio';
    this.autoService.consultarPorRangoPrecio(this.precioMin, this.precioMax).subscribe({
      next: (res: any) => {
        const data = res?.object;
        this.autos = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showMessage('Error al buscar por precio', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFiltros(): void {
    this.filterMarca = '';
    this.filterAgenciaId = null;
    this.precioMin = null;
    this.precioMax = null;
    this.activeFilter = '';
    this.cargarAutos();
  }

  confirmarEliminar(auto: Auto): void { this.deleteTarget = auto; }
  cancelarEliminar(): void { this.deleteTarget = null; }

  eliminar(): void {
    if (!this.deleteTarget?.idauto) return;
    this.autoService.eliminarAuto(this.deleteTarget.idauto).subscribe({
      next: () => {
        this.showMessage('Auto eliminado correctamente', 'success');
        this.deleteTarget = null;
        this.cargarAutos();
      },
      error: () => {
        this.showMessage('Error al eliminar auto', 'error');
        this.deleteTarget = null;
      }
    });
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN', maximumFractionDigits: 0
    }).format(precio);
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 3500);
  }
}