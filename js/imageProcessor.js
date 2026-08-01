// =========================================
// Image Processing
// =========================================

async function preprocessImage(file) {

    return new Promise((resolve) => {

        const img = new Image();

        img.onload = () => {

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {

                const gray =
                    0.299 * data[i] +
                    0.587 * data[i + 1] +
                    0.114 * data[i + 2];

                const value = gray > 180 ? 255 : 0;

                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;

            }

            ctx.putImageData(imageData, 0, 0);

            resolve(canvas);

        };

        img.src = URL.createObjectURL(file);

    });

}