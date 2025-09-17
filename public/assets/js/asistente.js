const iniciarAsistente =() => {
        
  const personal = document.getElementById('personal').textContent;

  const username = document.getElementById('username').textContent;
  const id_usuario = document.getElementById('id_usuario').textContent;

  const urlUser = `https://servicios.litoprocess.com/colaboradores/api/foto/${personal}`;
  const baseAPIUrl = 'https://servicios.litoprocess.com/openai';
  const asistantId=document.getElementById('asistantId').textContent;
  ///document.addEventListener('DOMContentLoaded', function () {
   // console.log('DOM completamente cargado y analizado');
      const chatToggleBtn = document.getElementById('chatToggleBtn');
      const chatBox = document.getElementById('chatBox');
      const closeChat = document.getElementById('closeChat');
      const sendBtn = document.getElementById('sendBtn');
      const messageInput = document.getElementById('messageInput');
      const chatBody = document.getElementById('chatBody');

      // Abrir/cerrar el chat
      chatToggleBtn.addEventListener('click', function () {
          chatBox.classList.toggle('active');
      });

      closeChat.addEventListener('click', function () {
          chatBox.classList.remove('active');
      });

      // Enviar mensaje al hacer clic en el botón
      sendBtn.addEventListener('click', function () {
          sendMessage();
      });

      // Enviar mensaje al presionar Enter (sin Shift)
      messageInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
          }
      });

      async function sendMessage() {
          const message = messageInput.value.trim();
          if (!message) return;

          // Deshabilitar interfaz
          disableInterface();

          // Añadir mensaje del usuario al chat
          addUserMessage(message);

          // Limpiar el campo de entrada
          messageInput.value = '';

          try {
              await fetchAssistantResponse(message);
          } catch (error) {
              console.error('Error:', error);
              addBotMessage('Lo siento, ha ocurrido un error al procesar tu solicitud.');
          } finally {
              hideTypingIndicator();
              enableInterface();
          }
      }

      function addUserMessage(text) {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'chat-message user-message';
          messageDiv.innerHTML = `
  <div class="avatar-container">
      <div class="avatar">
         <img src="${urlUser}"
               alt="Usuario"
               style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">
      </div>
      <span class="avatar-name">${username}</span>
  </div>
  <div class="message-content">${text}</div>
`;
          chatBody.appendChild(messageDiv);
          scrollToBottom();
      }


      function addBotMessage(text) {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'chat-message bot-message';
          messageDiv.innerHTML = `
  <div class="avatar-container">
      <div class="avatar">
          <i class="fas fa-robot"></i>
      </div>
      <span class="avatar-name">Asistente</span>
  </div>
  <div class="message-content">${text}</div>
`;
          chatBody.appendChild(messageDiv);
          scrollToBottom();
      }

      function showTypingIndicator() {
          const typingDiv = document.createElement('div');
          typingDiv.className = 'chat-message bot-message';
          typingDiv.id = 'typingIndicator';
          typingDiv.innerHTML = `
  <div class="avatar-container">
      <div class="avatar">
          <i class="fas fa-brain"></i>
      </div>
      <span class="avatar-name">Asistente</span>
  </div>
  <div class="typing-indicator">
      <div class="typing-animation">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
      </div>
  </div>
`;
          chatBody.appendChild(typingDiv);
          scrollToBottom();
      }

      function disableInterface() {
          messageInput.disabled = true;
          messageInput.classList.add('input-disabled');
          sendBtn.disabled = true;
          messageInput.placeholder = 'Espera mientras proceso tu pregunta...';
      }

      function enableInterface() {
          messageInput.disabled = false;
          messageInput.classList.remove('input-disabled');
          sendBtn.disabled = false;
          messageInput.placeholder = 'Escribe tu mensaje aquí...';
      }

      function hideTypingIndicator() {
          const typingIndicator = document.getElementById('typingIndicator');
          if (typingIndicator) {
              typingIndicator.remove();
          }
      }

      function scrollToBottom() {
          chatBody.scrollTop = chatBody.scrollHeight;
      }

      async function fetchAssistantResponse(question) {
          try {
              showTypingIndicator();
              const response = await fetch(`${baseAPIUrl}/sam-asistant/user-question-stream`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: id_usuario,
                      IdAsistant:asistantId,
                      question
                  }),
              });

              if (!response.ok) {
                  throw new Error('Error en la respuesta del servidor');
              }

              // Crear el mensaje del bot una sola vez
              const messageDiv = document.createElement('div');
              messageDiv.className = 'chat-message bot-message';
              messageDiv.innerHTML = `
<div class="avatar-container">
  <div class="avatar">
      <i class="fas fa-robot"></i>
  </div>
  <span class="avatar-name">Asistente</span>
</div>
<div class="message-content"></div>
`;
              hideTypingIndicator();
              chatBody.appendChild(messageDiv);
              const messageContent = messageDiv.querySelector('.message-content');
              let accumulatedText = '';

              const reader = response.body.getReader();
              const decoder = new TextDecoder();

              while (true) {
                  const { value, done } = await reader.read();
                  if (done) break;

                  const chunk = decoder.decode(value);
                  const lines = chunk.split('\n\n');

                  for (const line of lines) {
                      if (line.startsWith('data: ')) {
                          try {
                              const data = JSON.parse(line.substring(6));
                              if (data.data) {
                                  // Reemplazar \n con <br> o preservar los saltos de línea existentes
                                  accumulatedText += data.data;
                                  messageContent.innerHTML = accumulatedText
                                      .replace(/\n/g, '<br>')
                                      .replace(/\r/g, '');
                                  scrollToBottom();
                              }
                          } catch (e) {
                              console.error('Error al parsear datos:', e);
                          }
                      }
                  }
              }
          } catch (error) {
              console.error('Error al obtener respuesta:', error);
              hideTypingIndicator();
              addBotMessage('Lo siento, ha ocurrido un error al procesar tu solicitud.');
          } finally {
              enableInterface();
          }
      }

      async function init() {
          const response = await fetch(`${baseAPIUrl}/sam-asistant/get-messages/${id_usuario}/asistant/${asistantId}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          if (!response.ok) {
              document.querySelector('.chat-toggle-btn').style.display = 'none';
              document.querySelector('#asistenteTitulo').textContent = 'Asistente NO DISPONIBLE';
              disableInterface();
              throw new Error('Error en la respuesta del servidor');
          }
          const data = await response.json();
          const messages = data.messages;
          addBotMessage("Hola, ¿en qué puedo ayudarte hoy?");
          if (messages.length === 0) {
              return;
          }
          for (const message of messages) {
              if (message.role === "user") {
                  addUserMessage(message.text);
              } else {
                  addBotMessage(message.text);
              }
          }

      }
      init();

}