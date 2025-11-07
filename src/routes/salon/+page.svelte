<script>
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import { goto } from "$app/navigation";
    import { urlApi } from "../../utils/constant";

  let salon = "";
  let pseudo = "";
  let roomName = "";
  let message = "";
  let messages = [];
  let socket;

  function sendMessage() {
    if (!message.trim()) return;
    socket.emit("sendMessage", { text: message.trim() });
    message = "";
  }

  function scrollBottom() {
    const container = document.getElementById("msgContainer");
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  }

  function quitSalon() {
    if (socket) {
      socket.emit("leaveRoom", { roomId: salon, nick: pseudo });
      socket.disconnect();
    }
    localStorage.removeItem("salon");
    localStorage.removeItem("pseudo");
    goto("/", { replaceState: true });
  }

  onMount(async () => {
    salon = localStorage.getItem("salon") || "";
    pseudo = localStorage.getItem("pseudo") || "";
    if (!salon || !pseudo) return goto("/");

    const res = await fetch(`${urlApi}/rooms`);
    const rooms = await res.json();
    const room = rooms.find(r => r.id === salon);
    roomName = room ? room.name : salon;

    socket = io(`${urlApi}`);
    socket.emit("joinRoom", { roomId: salon, nick: pseudo });

    socket.on("previousMessages", (msgs) => {
      messages = msgs.filter(m => m.roomId === salon);
      scrollBottom();
    });

    socket.on("message", (msg) => {
      if (msg.roomId === salon) {
        messages = [...messages, msg];
        scrollBottom();
      }
    });
  });
</script>

<div class="bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-start min-h-screen">
  <div class="w-full max-w-4xl flex flex-col h-screen px-4 md:px-8">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-xl mb-4 overflow-hidden">
      <div class="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-white rounded-full animate-pulse ring-2 ring-white/50"></div>
            <div>
              <h2 class="text-xl font-bold text-primary-content">Salon : {roomName}</h2>
              <p class="text-primary-content/80 text-sm">
                Connecté en tant que <span class="font-semibold">{pseudo}</span>
              </p>
            </div>
          </div>

          <button
            class="btn btn-sm btn-ghost text-primary-content hover:bg-primary-content/20 gap-2 normal-case"
            on:click={quitSalon}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clip-rule="evenodd"
              />
            </svg>
            Quitter
          </button>
        </div>
      </div>
    </div>

    <!-- Zone principale : prend tout le reste de la hauteur -->
    <div class="bg-white rounded-2xl mb-3 shadow-xl flex flex-col flex-1 overflow-hidden">
      <!-- Messages -->
      <div id="msgContainer" class="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {#if messages.length === 0}
          <div class="flex items-center justify-center h-full">
            <div class="text-center text-base-content/40">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-lg font-medium">Aucun message pour le moment</p>
              <p class="text-sm mt-1">Soyez le premier à envoyer un message !</p>
            </div>
          </div>
        {/if}

        {#each messages as m}
          {#if m.nick === "System"}
            <div class="flex justify-center my-4">
              <div class="text-base-content/70 px-4 py-2 rounded-full text-sm font-light italic">
                {m.text}
              </div>
            </div>
          {:else if m.nick === pseudo}
            <div class="flex justify-end animate-in slide-in-from-right duration-300">
              <div class="max-w-[75%] md:max-w-[60%]">
                <div class="bg-gradient-to-br from-primary to-primary/80 text-primary-content px-5 py-3 rounded-2xl rounded-tr-sm shadow-lg">
                  <p class="break-words leading-relaxed">{m.text}</p>
                </div>
                <p class="text-xs text-base-content/50 mt-1 text-right">Vous</p>
              </div>
            </div>
          {:else}
            <div class="flex justify-start animate-in slide-in-from-left duration-300">
              <div class="max-w-[75%] md:max-w-[60%]">
                <p class="text-xs font-semibold text-base-content/70 mb-1 ml-1">{m.nick}</p>
                <div class="bg-base-200 text-base-content px-5 py-3 rounded-2xl rounded-tl-sm shadow-md">
                  <p class="break-words leading-relaxed">{m.text}</p>
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>

      <!-- Zone d’envoi -->
      <div class="border-t border-base-300 p-4 bg-base-100">
        <div class="flex gap-3 items-end">
          <div class="flex-1 relative">
            <textarea
              bind:value={message}
              placeholder="Tapez votre message..."
              class="textarea textarea-bordered w-full resize-none bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all rounded-xl pr-12"
              rows="1"
              style="min-height: 3rem; max-height: 8rem;"
              on:keydown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              on:input={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            ></textarea>
          </div>

          <button
            class="btn btn-primary rounded-xl px-6 shadow-lg hover:shadow-xl transition-all gap-2 normal-case h-[3rem] flex-shrink-0"
            on:click={sendMessage}
            disabled={!message.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              />
            </svg>
            Envoyer
          </button>
        </div>

        <p class="text-xs text-base-content/50 mt-2 ml-1">
          Appuyez sur <kbd>Entrée</kbd> pour envoyer, <kbd>Shift + Entrée</kbd> pour une nouvelle ligne
        </p>
      </div>
    </div>
  </div>
</div>


<style>
  @keyframes slide-in-from-right {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-left {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-in {
    animation-fill-mode: both;
  }

  .slide-in-from-right {
    animation-name: slide-in-from-right;
  }

  .slide-in-from-left {
    animation-name: slide-in-from-left;
  }

  .duration-300 {
    animation-duration: 300ms;
  }

  #msgContainer::-webkit-scrollbar {
    width: 6px;
  }

  #msgContainer::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  #msgContainer::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  #msgContainer::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>