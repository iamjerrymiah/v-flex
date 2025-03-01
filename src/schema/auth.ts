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
    terms: Yup.boolean().oneOf([true], "You must accept the terms"),
});