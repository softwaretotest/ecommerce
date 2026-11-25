export const compressImage = async (file, maxSizeKB = 200) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        reader.onerror = (err) => reject(err);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const maxWidth = 800;
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            let quality = 0.9;
            const minQuality = 0.3;
            const step = 0.05;

            const tryCompress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Canvas toBlob failed"));
                            return;
                        }

                        const sizeKB = blob.size / 1024;
                        if (sizeKB <= maxSizeKB || quality <= minQuality) {
                            const fileName =
                                (file?.name
                                    ? file.name.replace(/\.[^/.]+$/, "")
                                    : "image") + ".jpg";

                            const compressedFile = new File([blob], fileName, {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            });

                            resolve(compressedFile);
                            return;
                        }

                        quality = Number((quality - step).toFixed(2));
                        tryCompress();
                    },
                    "image/jpeg",
                    quality,
                );
            };

            tryCompress();
        };

        reader.readAsDataURL(file);
    });
};