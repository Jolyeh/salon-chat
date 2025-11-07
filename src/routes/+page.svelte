<script>
    import { goto } from "$app/navigation";
    import { urlApi } from "../utils/constant";
    import { hideLoadingModal, showLoadingModal, Toast } from "../utils/toast";

    let salon = "";
    let pseudo = "";

    // 🔹 Créer un salon
    async function createSalon(event) {
        event.preventDefault();
        if (!salon.trim() || !pseudo.trim()) {
            return Toast.error("Nom du salon et pseudo requis");
        }

        try {
            showLoadingModal();

            const res = await fetch(`${urlApi}/rooms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: salon.trim() }),
            });

            const data = await res.json();
            hideLoadingModal();

            if (!res.ok) {
                return Toast.error(
                    data.message || "Erreur lors de la création du salon",
                );
            }

            if (!data?.status || !data?.id) {
                return Toast.error("Réponse inattendue du serveur");
            }

            localStorage.setItem("salon", data.id);
            localStorage.setItem("pseudo", pseudo.trim());

            Toast.success("Salon créé avec succès !");
            goto("/salon", { replaceState: true });
        } catch (error) {
            console.error("Erreur lors de la création du salon :", error);
            hideLoadingModal();
            Toast.error("Impossible de créer le salon. Vérifie ta connexion.");
        }
    }

    // 🔹 Rejoindre un salon
    async function joinSalon(event) {
        event.preventDefault();
        if (!salon.trim() || !pseudo.trim()) {
            return Toast.error("Nom/ID du salon et pseudo requis");
        }

        try {
            showLoadingModal();

            const res = await fetch(`${urlApi}/rooms`);
            const rooms = await res.json();
            hideLoadingModal();

            if (!Array.isArray(rooms)) {
                return Toast.error("Erreur inattendue côté serveur");
            }

            const room = rooms.find(
                (r) =>
                    r.id === salon.trim() ||
                    r.name.toLowerCase() === salon.trim().toLowerCase(),
            );
            if (!room) {
                return Toast.error("Salon introuvable");
            }

            localStorage.setItem("salon", room.id);
            localStorage.setItem("pseudo", pseudo.trim());

            Toast.success(`Rejoint le salon "${room.name}"`);
            goto("/salon", { replaceState: true });
        } catch (error) {
            console.error("Erreur lors de la recherche du salon :", error);
            hideLoadingModal();
            Toast.error(
                "Impossible de rejoindre le salon. Vérifie ta connexion.",
            );
        }
    }
</script>

<section
    class="hero min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10"
>
    <div
        class="hero-content flex flex-col items-center justify-center text-center px-6 py-10 md:py-20"
    >
        <!-- Icône principale -->
        <div class="mb-8 animate-bounce">
            <img src="images/icon.png" class="h-25 w-25" alt="icon" srcset="" />
        </div>

        <!-- Titre principal -->
        <h1 class="text-3xl md:text-5xl font-extrabold text-primary mb-2">
            Bienvenue sur J-Salon
        </h1>

        <!-- Sous-titre -->
        <p class="text-lg md:text-xl text-base-content/80 font-medium mb-4">
            Ici, ton identité n’a pas d’importance.
        </p>

        <!-- Description -->
        <p
            class="text-base md:text-lg text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
            Rejoins une communauté où chacun peut s’exprimer sans jugement.
            Aucun enregistrement, aucun historique : chaque message disparaît
            avec le temps. Sois respectueux, bienveillant, et amuse-toi à
            rencontrer de nouvelles personnes, anonymement !
        </p>

        <!-- action -->
        <div class="flex gap-3 justify-content-center items-center">
            <button
                on:click={() => create_salon_modal.showModal()}
                class="btn btn-primary">Créer un salon</button
            >
            <p>ou</p>
            <button
                on:click={() => join_salon_modal.showModal()}
                class="btn btn-outline btn-primary">Rejoindre un salon</button
            >
        </div>
    </div>
</section>

<!-- Modal créer salon -->
<dialog id="create_salon_modal" class="modal">
    <form class="modal-box" method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >✕</button
        >
        <h3 class="font-bold text-lg mb-4">Créer un salon</h3>
        <div class="mb-2">
            <label class="label mb-1">Nom du salon</label>
            <input
                type="text"
                placeholder="Nom du salon"
                bind:value={salon}
                class="input input-bordered w-full mb-2"
            />
        </div>

        <div>
            <label class="label mb-1">Pseudo</label>
            <input
                type="text"
                placeholder="Pseudo"
                bind:value={pseudo}
                class="input input-bordered w-full mb-4"
            />
        </div>
        <button class="btn btn-primary w-full" on:click={createSalon}
            >Créer</button
        >
    </form>
</dialog>

<!-- Modal rejoindre salon -->
<dialog id="join_salon_modal" class="modal">
    <form class="modal-box" method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >✕</button
        >
        <h3 class="font-bold text-lg mb-4">Rejoindre un salon</h3>

        <div class="mb-2">
            <label class="label mb-1">Nom du salon</label>
            <input
                type="text"
                placeholder="Nom du salon"
                bind:value={salon}
                class="input input-bordered w-full mb-2"
            />
        </div>

        <div>
            <label class="label mb-1">Pseudo</label>
            <input
                type="text"
                placeholder="Pseudo"
                bind:value={pseudo}
                class="input input-bordered w-full mb-4"
            />
        </div>
        <button class="btn btn-primary w-full" on:click={joinSalon}
            >Rejoindre</button
        >
    </form>
</dialog>
