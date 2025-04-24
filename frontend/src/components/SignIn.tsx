
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

type SignInData = {
  email: string;
  password: string;
}

export const SignIn = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<SignInData>();
  const navigate = useNavigate();
  const onSubmit = async (data: SignInData) => {

    const response = await fetch("http://localhost:3000/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include"
    });


    if (response.ok) {
      navigate("/dashboard");
    } else {
      prompt("Inloggning misslyckades");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")} />
        <label htmlFor="password">Password</label>
        <input type="password" {...register("password")} />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};