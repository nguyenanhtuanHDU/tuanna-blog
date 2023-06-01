import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { equalTo } from "@popeyelab/ngx-validator";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePWForm = new FormGroup({
    old: new FormControl('', [Validators.required, Validators.minLength(6)]),
    new: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirm: new FormControl('', [Validators.required, equalTo('new')]),
  });
  userID: string

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    console.log('run change pw');
    this.route.params.subscribe(params => {
      this.userID = params['id']
      console.log(`🚀 ~ this.userID:`, this.userID)
    });
  }

  validateFormChangePassword() {
    let check = true
    const oldPW = this.changePWForm.get('old')?.value
    const newPW = this.changePWForm.get('new')?.value
    const confirmPW = this.changePWForm.get('confirm')?.value
    if (oldPW && newPW) {
      if (oldPW?.length < 6 || newPW?.length < 6) {
        check = false
      } else if (newPW !== confirmPW) {
        check = false
      }
    } else if (!oldPW || !newPW) {
      check = false
    }
    console.log(`🚀 ~ check:`, check)
    return check
  }

  updateUserPassword() {
    if (this.validateFormChangePassword() === false) {
      return
    }
    const oldPassword = this.changePWForm.get('old')?.value
    console.log(`🚀 ~ oldPassword:`, oldPassword)
    const newPassword = this.changePWForm.get('new')?.value
    console.log(`🚀 ~ newPassword:`, newPassword)
    if (oldPassword !== null && newPassword !== null) {
      this.userService.updatePassword(this.userID, oldPassword as string, newPassword as string).subscribe((data: any) => {
        console.log(`🚀 ~ data:`, data)
        Swal.fire(data.msg, '', 'success')
        this.router.navigate([''])
      }, (err) => {
        Swal.fire(err.error.msg, '', 'error')
      })
    }
  }
}

