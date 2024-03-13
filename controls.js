// Controls class handles the control inputs for the car

class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch (type) {
            case "KEYS":
                // Add keyboard event listeners for control inputs
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                // Set forward to true for dummy controls (always moving forward)
                this.forward = true;
                break;
        }
    }

    // Add keyboard event listeners for control inputs
    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        };
    }
}
