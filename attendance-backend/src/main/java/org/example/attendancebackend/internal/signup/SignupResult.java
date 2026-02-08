package org.example.attendancebackend.internal.signup;

public class SignupResult {
    public boolean success;
    public SignupError errorStatus;

    public static SignupResult ok(){
        SignupResult rval = new SignupResult();
        rval.success = true;
        return rval;
    }

    public static SignupResult failure(SignupError error){
        SignupResult rval = new SignupResult();
        rval.success = false;
        rval.errorStatus = error;
        return rval;
    }
}
