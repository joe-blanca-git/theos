import { Component,Input,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-ava-avalia',
  templateUrl: './ava-avalia.component.html',
  styleUrls: ['./ava-avalia.component.css']
})
export class AvaAvaliaComponent {
  @Input('status') statusModal: boolean | undefined;
  @Output() statusChange = new EventEmitter<boolean>();


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  showModal(): void {
    this.statusModal = true;
  }

  handleOk(): void {
    this.statusModal = false;
    const cursoId = this.route.snapshot.queryParamMap.get('curso');
    this.router.navigate(['/ava/ava-curso-detalhe'], { queryParams: { curso: cursoId } });
  }

  handleCancel(): void {
    this.statusModal = false;
  }
}
