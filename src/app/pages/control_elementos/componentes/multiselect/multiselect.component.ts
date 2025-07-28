import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'multiselect',
  imports: [CommonModule,FormsModule],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.css'
})
export class MultiselectComponent {
  dropdownOpen = false;

  items = [
    { name: 'Elemento 1', optionA: false, optionB: false },
    { name: 'Elemento 2', optionA: false, optionB: false },
    { name: 'Elemento 3', optionA: false, optionB: false },
  ];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  getSelected() {
    return this.items.filter(item => item.optionA || item.optionB);
  }
}
