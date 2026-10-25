import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GymLeaderService } from '../gym-leader';
import { LeaderCard } from '../leader-card/leader-card';

@Component({
  selector: 'app-leader-list',
  imports: [LeaderCard, RouterLink],
  templateUrl: './leader-list.html',
  styleUrl: './leader-list.css',
})
export class LeaderList implements OnInit {
  private readonly leaderService = inject(GymLeaderService);
  private readonly router = inject(Router);

  readonly regions = ['All', 'Kanto', 'Johto', 'Hoenn'] as const;
  readonly selectedRegion = signal<string>('All');

  readonly filteredLeaders = computed(() => {
    const region = this.selectedRegion();
    const leaders = this.leaderService.leaders();
    if (region === 'All') {
      return leaders;
    }
    return leaders.filter((leader) => leader.region === region);
  });

  ngOnInit(): void {
    this.leaderService.fetchLeaders();
  }

  selectRegion(region: string): void {
    this.selectedRegion.set(region);
  }

  onEdit(id: string): void {
    this.router.navigate(['/leaders', id, 'edit']);
  }

  onRemove(id: string, name: string): void {
    if (confirm(`Remove ${name} from the registry?`)) {
      this.leaderService.deleteLeader(id).subscribe({
        next: () => this.leaderService.fetchLeaders(),
      });
    }
  }
}
