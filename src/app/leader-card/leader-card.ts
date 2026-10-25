import { Component, input, output } from '@angular/core';
import { GymLeader } from '../gym-leader.model';

@Component({
  selector: 'app-leader-card',
  templateUrl: './leader-card.html',
  styleUrl: './leader-card.css',
})
export class LeaderCard {
  readonly leader = input.required<GymLeader>();
  readonly edit = output<string>();
  readonly remove = output<string>();

  onEditClick(): void {
    const id = this.leader()._id;
    if (id) {
      this.edit.emit(id);
    }
  }

  onRemoveClick(): void {
    const id = this.leader()._id;
    if (id) {
      this.remove.emit(id);
    }
  }
}
