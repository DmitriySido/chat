const Login = () => {
  
  return(
    <div className="login__wrapper">
      <form action="">
        <input type="text" placeholder="Username" required/>
        <input type="password" name="password" placeholder="Password" />
        <button>Login</button>
      </form>
    </div>
  )
}

export default Login