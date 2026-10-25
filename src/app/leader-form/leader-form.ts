import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GymLeaderService } from '../gym-leader';
import { GymLeader } from '../gym-leader.model';

@Component({
  selector: 'app-leader-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css',
})
export class LeaderForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly leaderService = inject(GymLeaderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly editingId = signal<string | null>(null);
  readonly errorMessage = signal('');

  readonly leaderForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['Kanto' as 'Kanto' | 'Johto' | 'Hoenn', [Validators.required]],
    town: ['', [Validators.required]],
    badge: ['', [Validators.required]],
    specialty: ['', [Validators.required]],
    aceLevel: [
      10,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.pattern(/^\d+$/),
      ],
    ],
    motto: ['', [Validators.maxLength(150)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(id);
      this.leaderService.getLeader(id).subscribe({
        next: (leader) => {
          this.leaderForm.patchValue({
            name: leader.name,
            region: leader.region,
            town: leader.town,
            badge: leader.badge,
            specialty: leader.specialty,
            aceLevel: leader.aceLevel,
            motto: leader.motto ?? '',
          });
        },
        error: () => {
          this.errorMessage.set('Unable to load the requested Gym Leader record.');
        },
      });
    }
  }

  onSubmit(): void {
    if (this.leaderForm.invalid) {
      this.leaderForm.markAllAsTouched();
      return;
    }

    const payload: GymLeader = this.leaderForm.getRawValue();
    const currentId = this.editingId();

    if (currentId) {
      this.leaderService.updateLeader(currentId, payload).subscribe({
        next: () => {
          this.leaderForm.reset();
          this.router.navigate(['/leaders']);
        },
        error: () => {
          this.errorMessage.set('Failed to update Gym Leader. Please verify all fields.');
        },
      });
    } else {
      this.leaderService.addLeader(payload).subscribe({
        next: () => {
          this.leaderForm.reset();
          this.router.navigate(['/leaders']);
        },
        error: () => {
          this.errorMessage.set('Failed to add Gym Leader. Please verify all fields.');
        },
      });
    }
  }
}
