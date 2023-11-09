document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const premiumButton = document.getElementById("premiumButton");

    premiumButton.addEventListener("click", async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch("/profile/becomePremium", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Ya Eres Premium!",
                    showClass: {
                      popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                      `
                    },
                    hideClass: {
                      popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                      `
                    }
                  });

                setTimeout(() => {
                    window.location.href = "/products";
                }, 1500);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: result.error,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error interno del servidor',
            });
        }
    });
});
