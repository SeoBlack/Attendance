package org.example.attendancebackend.internal.signup;

public class SignupResult {
    public boolean success;
    public SignupErrorStatus error;

    public static SignupResult ok(){
        SignupResult rval = new SignupResult();
        rval.success = true;
        return rval;
    }

    public static SignupResult failure(SignupErrorStatus error){
        SignupResult rval = new SignupResult();
        rval.success = false;
        rval.error = error;
        return rval;
    }
}
