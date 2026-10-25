import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GymLeaderService } from '../gym-leader';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  protected readonly leaderService = inject(GymLeaderService);

  ngOnInit(): void {
    this.leaderService.fetchLeaders();
  }
}
