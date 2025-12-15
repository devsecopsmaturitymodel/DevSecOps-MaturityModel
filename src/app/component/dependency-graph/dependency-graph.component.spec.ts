import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DependencyGraphComponent } from './dependency-graph.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('DependencyGraphComponent', () => {
  let component: DependencyGraphComponent;
  let fixture: ComponentFixture<DependencyGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DependencyGraphComponent],
      imports: [MatDialogModule],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
