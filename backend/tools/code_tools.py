import sys
import io
import traceback

def python_interpreter(code: str) -> str:
    """Executes Python code dynamically in a sandboxed context and returns stdout/stderr. 
    Use this to run calculations, test scripts, or execute logic.
    
    Args:
        code: The raw Python code to execute.
    """
    # Create file-like objects to capture stdout and stderr
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    redirected_output = sys.stdout = io.StringIO()
    redirected_error = sys.stderr = io.StringIO()
    
    # Define a local dictionary for execution context
    local_env = {}
    
    try:
        # Execute the code
        exec(code, {}, local_env)
        sys.stdout = old_stdout
        sys.stderr = old_stderr
        
        stdout = redirected_output.getvalue()
        stderr = redirected_error.getvalue()
        
        output = ""
        if stdout:
            output += f"Output:\n{stdout}\n"
        if stderr:
            output += f"Errors:\n{stderr}\n"
        if not stdout and not stderr:
            output = "Code executed successfully with no output."
            
        return output
    except Exception as e:
        sys.stdout = old_stdout
        sys.stderr = old_stderr
        return f"Execution failed:\n{traceback.format_exc()}"
