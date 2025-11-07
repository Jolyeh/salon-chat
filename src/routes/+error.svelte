<div class="brand-gradient-light min-h-screen flex items-center justify-center px-4">
  <div class="text-center">
      <!-- Animation du nombre 404 -->
      <div class="mb-8">
          <h1 class="text-9xl font-bold brand-color animate-pulse">
              404
          </h1>
      </div>
      
      <!-- Message -->
      <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Oups! Page non trouvée
      </h2>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          La page que vous recherchez semble s'être perdue dans le cyberespace. Elle a peut-être été déplacée ou n'existe plus.
      </p>
      
      <!-- Boutons d'action -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" class="brand-gradient hover:opacity-90 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg">
              Retour à l'accueil
          </a>
          <button class="bg-white hover:bg-gray-50 brand-color font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 border-2 shadow-lg" style="border-color: #14529D;">
              Page précédente
          </button>
      </div>
      
      <!-- Décoration -->
      <div class="mt-12 flex justify-center gap-2">
          <div class="w-2 h-2 brand-bg rounded-full animate-bounce"></div>
          <div class="w-2 h-2 brand-bg rounded-full animate-bounce opacity-75" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 brand-bg rounded-full animate-bounce opacity-50" style="animation-delay: 0.2s"></div>
      </div>
  </div>
</div>

<style>
  .brand-color {
      color: #14529D;
  }
  .brand-bg {
      background-color: #14529D;
  }
  .brand-gradient {
      background: linear-gradient(135deg, #14529D 0%, #1a6bc4 100%);
  }
  .brand-gradient-light {
      background: linear-gradient(135deg, #e8f1fb 0%, #f0f6fd 100%);
  }
</style>