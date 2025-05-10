import { Component, Input, Output, SimpleChanges ,EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-error-popup',
  imports: [CommonModule],
  templateUrl: './error-popup.component.html',
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ErrorPopupComponent {
  @Input() message: string = '';
  @Input() isVisible: boolean = false;
  @Output() closed = new EventEmitter<void>();
  

  internalVisible: boolean = false;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']) {
      if (this.isVisible) {
        this.showPopup();
      } else {
        this.internalVisible = false;
      }
    }
  }
  
  showPopup(): void {
    this.internalVisible = false;
    setTimeout(() => {
      this.internalVisible = true;
    }, 0);
  }
  
  closePopup(): void {
    this.internalVisible = false;
    this.closed.emit();
  }
}
