class Kasam {
    constructor(executor) {
      this.state = 'pending';
      this.value = undefined;
      this.reason = undefined;
      this.handlers = [];
  
      const resolve = (value) => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          this.handlers.forEach(this._handle);
        }
      };
  
      const reject = (reason) => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.reason = reason;
          this.handlers.forEach(this._handle);
        }
      };
  
      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
  
    _handle = ({ onSuccess, onFail }) => {
      if (this.state === 'fulfilled') {
        if (onSuccess) onSuccess(this.value);
      } else if (this.state === 'rejected') {
        if (onFail) onFail(this.reason);
      }
    }
  
    then(onSuccess, onFail) {
      return new Kasam((resolve, reject) => {
        const handleFulfilled = () => {
          try {
            const result = onSuccess ? onSuccess(this.value) : this.value;
            resolve(result);
          } catch (error) {
            reject(error);
          }
        };
  
        const handleRejected = () => {
          try {
            if (onFail) {
              const result = onFail(this.reason);
              resolve(result);
            } else {
              reject(this.reason);
            }
          } catch (error) {
            reject(error);
          }
        };
  
        if (this.state === 'fulfilled') {
          handleFulfilled();
        } else if (this.state === 'rejected') {
          handleRejected();
        } else {
          this.handlers.push({ onSuccess: handleFulfilled, onFail: handleRejected });
        }
      });
    }
  
    catch(onFail) {
      return this.then(null, onFail);
    }
  }

  