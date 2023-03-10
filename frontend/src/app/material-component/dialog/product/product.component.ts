import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter()
  onEditProduct = new EventEmitter()
  onDeleteProduct = new EventEmitter()
  productForm: any = FormGroup;
  dialogAction: any = 'Add'
  action: any = 'Add'
  responseMessage: any
  categories: any = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<ProductComponent>,
    private productService: ProductService,
    private formBuider: FormBuilder,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuider.group({
      name: [null, [Validators.required]],
      categoryId: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
    })
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit"
      this.action = "Update"
      this.productForm.patchValue(this.dialogData.data)
    }
    this.getCategory()
  }

  getCategory() {
    this.categoryService.getCategory().subscribe((response: any) => {
      this.categories = response;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit()
    } else {
      this.add()
    }
  }

  add() {
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    }
    this.productService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      if (error.error?.message) {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit() {
    var formData = this.productForm.value
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    }
    this.productService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      if (error.error?.message) {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
