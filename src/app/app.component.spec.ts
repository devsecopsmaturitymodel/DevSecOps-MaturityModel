import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { Title } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let titleService: Title;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'DSOMM'`, () => {
    expect(app.title).toEqual('DSOMM');
  });

  it('check for fork me on github ribbon generation', () => {
    const HTMLElement: HTMLElement = fixture.nativeElement;
    var divTag = HTMLElement.querySelector('div')!;
    var aTag = divTag.querySelector('a')!;
    expect(aTag.textContent).toEqual('Fork me on GitHub');
  });

  it(`should set the document title to 'DSOMM' when initialized`, () => {
    expect(titleService.getTitle()).toBe('DSOMM');
  });

  it(`should update the document title to 'DSOMM - New Page' when 'updateTitle()' is called with 'New Page'`, () => {
    app.updateTitle('New Page');
    expect(titleService.getTitle()).toBe('DSOMM - New Page');
  });

  it(`should update the document title to 'DSOMM - Matrix' when navigating to the default route`, () => {
    router.navigateByUrl('/');
    fixture.detectChanges();
    expect(titleService.getTitle()).toBe('DSOMM - Matrix');
  });

  it(`should update the document title to 'DSOMM - About Us' when navigating to the 'about' route`, () => {
    router.navigateByUrl('/about');
    fixture.detectChanges();
    expect(titleService.getTitle()).toBe('DSOMM - About Us');
  });
});
