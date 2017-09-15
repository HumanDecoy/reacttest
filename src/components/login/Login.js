import React, {Component} from 'react';

class Login extends Component{


	render() {
		
		const hasError = this.props.error ? 'has-danger' : null;
        

		return(
			<div style={{maxWidth: "30%", margin: "5rem auto"}}>
				<form onSubmit={this.props.onSubmitLog}>
					<div className={`form-group ${hasError}`}>
						<label htmlFor="username">email</label>
						<input 
						type="text" 
						className="form-control" 
						name="username" 
						onChange={this.props.onChange}
						value={this.props.username}
						/>


					</div>
					<div className={`form-group ${hasError}`}>
						<label htmlFor="password">Password</label>
					<input 
						type="password" 
						className="form-control" 
						name="password"
						onChange={this.props.onChange}
						value={this.props.password}
						/>
							{ this.props.error && 
				<div className="form-control-feedback">ERROR ERROR ERROR</div>}

					</div>
				<input 
					className="btn btn-success" 
					type="submit"
                    onClick={this.props.signIn} 
					value="Login" />
                   
                    <input 
					className="btn btn-primary" 
					type="submit" 
                    onClick={this.props.register}
					value="Register" />

              
				</form>


			</div>
			);
	}
}

export default Login