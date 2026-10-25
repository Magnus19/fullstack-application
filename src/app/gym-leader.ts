import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GymLeader } from './gym-leader.model';

@Injectable({
  providedIn: 'root',
})
export class GymLeaderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/leaders';

  readonly leaders = signal<GymLeader[]>([]);

  readonly kantoCount = computed(
    () => this.leaders().filter((leader) => leader.region === 'Kanto').length
  );

  readonly johtoCount = computed(
    () => this.leaders().filter((leader) => leader.region === 'Johto').length
  );

  readonly hoennCount = computed(
    () => this.leaders().filter((leader) => leader.region === 'Hoenn').length
  );

  fetchLeaders(): void {
    this.http.get<GymLeader[]>(this.apiUrl).subscribe({
      next: (leaders) => this.leaders.set(leaders),
    });
  }

  getLeader(id: string): Observable<GymLeader> {
    return this.http.get<GymLeader>(`${this.apiUrl}/${id}`);
  }

  addLeader(leader: GymLeader): Observable<GymLeader> {
    return this.http.post<GymLeader>(this.apiUrl, leader).pipe(
      tap((savedLeader) =>
        this.leaders.update((leaders) => [...leaders, savedLeader])
      )
    );
  }

  updateLeader(id: string, leader: GymLeader): Observable<GymLeader> {
    return this.http.put<GymLeader>(`${this.apiUrl}/${id}`, leader).pipe(
      tap((updatedLeader) =>
        this.leaders.update((leaders) =>
          leaders.map((item) => (item._id === id ? updatedLeader : item))
        )
      )
    );
  }

  deleteLeader(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() =>
        this.leaders.update((leaders) =>
          leaders.filter((item) => item._id !== id)
        )
      )
    );
  }
}
