import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ← agrega ChangeDetectorRef
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgenciaService } from '../../../services/agenciaService';
import { Agencia } from '../../../model/agencia';

@Component({
  selector: 'app-agencia-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './agencia-list.html',
  styleUrl: './agencia-list.css',
})
export class AgenciaList implements OnInit {

  agencias: Agencia[] = [];
  filteredAgencias: Agencia[] = [];
  searchCiudad = '';
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  deleteTarget: Agencia | null = null;

  constructor(
    private agenciaService: AgenciaService,
    private cdr: ChangeDetectorRef // ← inyecta aquí
  ) {}

  ngOnInit(): void {
    this.cargarAgencias();
  }

  cargarAgencias(): void {
    this.loading = true;
    this.agenciaService.consultarAgencias().subscribe({
      next: (res) => {
        const data = res?.object;
        this.agencias = Array.isArray(data) ? data : [];
        this.filteredAgencias = [...this.agencias];
        this.loading = false;
        this.cdr.detectChanges(); // ← fuerza actualización de la vista
      },
      error: (err) => {
        console.error('Error HTTP:', err);
        this.showMessage('Error al cargar agencias', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarPorCiudad(): void {
    const termino = this.searchCiudad.trim().toLowerCase();
    if (!termino) {
      this.filteredAgencias = [...this.agencias];
      return;
    }
    this.filteredAgencias = this.agencias.filter(a =>
      a.ciudad?.toLowerCase().includes(termino)
    );
  }

  limpiarFiltro(): void {
    this.searchCiudad = '';
    this.filteredAgencias = [...this.agencias];
  }

  confirmarEliminar(agencia: Agencia): void {
    this.deleteTarget = agencia;
  }

  cancelarEliminar(): void {
    this.deleteTarget = null;
  }

  eliminar(): void {
    if (!this.deleteTarget?.idagencia) return;
    this.agenciaService.eliminarAgencia(this.deleteTarget.idagencia).subscribe({
      next: () => {
        this.showMessage('Agencia eliminada correctamente', 'success');
        this.deleteTarget = null;
        this.cargarAgencias();
      },
      error: () => {
        this.showMessage('Error al eliminar agencia', 'error');
        this.deleteTarget = null;
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 3500);
  }
}