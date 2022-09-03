import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ymlService } from '../../service/yaml-parser/yaml-parser.service';
import { DependencyGraphComponent } from './dependency-graph.component';

describe('DependencyGraphComponent', () => {
  let component: DependencyGraphComponent;
  let fixture: ComponentFixture<DependencyGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HttpClient, ymlService, HttpHandler],
      declarations: [DependencyGraphComponent],
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
