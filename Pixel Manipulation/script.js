document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const encryptButton = document.getElementById('encryptButton');
    const decryptButton = document.getElementById('decryptButton');
    const downloadButton = document.getElementById('downloadButton');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let originalImageData = null;
    let encryptedImageData = null;

    imageInput.addEventListener('change', loadImage);
    encryptButton.addEventListener('click', encryptImage);
    decryptButton.addEventListener('click', decryptImage);
    downloadButton.addEventListener('click', downloadImage);

    function loadImage(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function encryptImage() {
        if (!originalImageData) return;
        const imageData = new ImageData(new Uint8ClampedArray(originalImageData.data), originalImageData.width, originalImageData.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
            // Basic encryption: swap red and blue channels and invert green channel
            let r = imageData.data[i];
            let g = imageData.data[i + 1];
            let b = imageData.data[i + 2];

            imageData.data[i] = b;
            imageData.data[i + 1] = 255 - g;
            imageData.data[i + 2] = r;
        }

        ctx.putImageData(imageData, 0, 0);
        encryptedImageData = imageData;
    }

    function decryptImage() {
        if (!encryptedImageData) return;
        const imageData = new ImageData(new Uint8ClampedArray(encryptedImageData.data), encryptedImageData.width, encryptedImageData.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
            // Decrypt by reversing the encryption process
            let r = imageData.data[i];
            let g = 255 - imageData.data[i + 1];
            let b = imageData.data[i + 2];

            imageData.data[i] = b;
            imageData.data[i + 1] = g;
            imageData.data[i + 2] = r;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'encrypted-image.png';
        link.href = canvas.toDataURL();
        link.click();
    }
});
