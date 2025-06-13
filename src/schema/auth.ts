import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is Required"),
    password: Yup.string().min(8, "At least 8 characters").required("Password Required"),
})

export const registerSchema = Yup.object().shape({
    salutation: Yup.string().required("Salutation is Required"),
    firstName: Yup.string().required("First Name is Required"),
    lastName: Yup.string().required("Last Name is Required"),
    country: Yup.string().required("Country is Required"),
    phoneNumber: Yup.string().required("Phone Number is Required"),
    email: Yup.string().email("Invalid email").required("Email is Required"),
    confirmEmail: Yup.string()
      .oneOf([Yup.ref("email")], "Emails must match")
      .required("Required"),
    password: Yup.string().min(8, "At least 8 characters").required("Password is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    // terms: Yup.boolean().oneOf([true], "You must accept the terms"),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
})

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, "At least 8 characters").required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
})

export const addressSchema = Yup.object().shape({
  salutation: Yup.string().required("Salutation is Required"),
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  address: Yup.string().required("Address is Required"),
  city: Yup.string().required("City is Required"),
  country: Yup.string().required("Country is Required"),
  postalCode: Yup.string().required("Postal Code is Required"),
  defaultAddress: Yup.string().required("Set Default Address"),
  phoneNumber: Yup.string().required("Phone Number is Required"),
  // phoneNumber2: Yup.string().required("Phone Number 2 is Required"),
  // optionalData: Yup.string().required("Additional Info is Required"),
})

export const accountDetailsSchema = Yup.object().shape({
  salutation: Yup.string().required("Salutation is Required"),
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  // email: Yup.string().email("Invalid email").required("Email is Required"),
  country: Yup.string().required("Country is Required"),
  phoneNumber: Yup.string().required("Phone Number is Required"),
})

export const productSchema = Yup.object().shape({
  name: Yup.string().required("Product Name is Required"),
  price: Yup.string().required("Price is Required"),
  // oldPrice: Yup.string().required("Old Price is Required"),
  quantity: Yup.string().required("Quantity is Required"),
  sizes: Yup.string().required("Sizes is Required"),
  colors: Yup.string().required("Colors is Required"),
  freeShipping: Yup.string().required("Free Shipping is Required"),
  availability: Yup.string().required("Availability is Required"),
  category: Yup.string().required("Categories is Required"),
  // subCategories: Yup.string().required("Sub Categories is Required"),
  description: Yup.string().required("Description is Required"),
  // acceptCrypto: Yup.string().required("Accept Crypto is Required"),
})