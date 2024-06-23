const emailRegexp =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const passwordRegexp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const usernameRegexp = /^.{3,16}$/;

export function CheckRegisterCredentials(user: {
  [k: string]: FormDataEntryValue;
}): string {
  const email = (user.email as string).toLowerCase();
  const password = (user.password as string).toLowerCase();
  const username = (user.username as string).toLowerCase();

  if (email === "" || username === "" || password === "")
    return "Please, fill all the fields";

  if (!email.match(emailRegexp))
    return "The entered email address is not valid";

  if (!username.match(usernameRegexp))
    return "Username is too short or too long";

  if (!password.match(passwordRegexp))
    return "Password doesn't meet complexity requirements";

  return "OK";
}

export function CheckLoginCredentials(user: {
  [k: string]: FormDataEntryValue;
}): string {
  const password = (user.password as string).toLowerCase();
  const username = (user.username as string).toLowerCase();

  if (username === "" || password === "") return "Please, fill all the fields";

  if (!username.match(usernameRegexp) || !password.match(passwordRegexp))
    return "Username or password has incorrect format";

  return "OK";
}
