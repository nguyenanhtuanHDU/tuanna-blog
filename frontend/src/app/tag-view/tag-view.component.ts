import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.component.html',
  styleUrls: ['./tag-view.component.scss']
})
export class TagViewComponent {
  // @Input() content: string
  @Input() type: string
}
