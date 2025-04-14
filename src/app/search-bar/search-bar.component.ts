import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-search-bar",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./search-bar.component.html",
})
export class SearchBarComponent {
  @Input() placeholder = "Rechercher..."
  @Input() value = ""
  @Output() search = new EventEmitter<string>()

  searchTerm = ""

  constructor() {}

  ngOnInit(): void {
    this.searchTerm = this.value
  }

  onSearch(): void {
    this.search.emit(this.searchTerm)
  }

  onClear(): void {
    this.searchTerm = ""
    this.search.emit("")
  }
}

