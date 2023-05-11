import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTopComponent } from './post-top.component';

describe('PostTopComponent', () => {
  let component: PostTopComponent;
  let fixture: ComponentFixture<PostTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
