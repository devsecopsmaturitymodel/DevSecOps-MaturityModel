import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('check for fork me on github ribbon generation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const HTMLElement: HTMLElement = fixture.nativeElement;
    var divTag = HTMLElement.querySelector('div')!;
    var aTag = divTag.querySelector('a')!;
    expect(aTag.textContent).toContain('GitHub');
  });
});
