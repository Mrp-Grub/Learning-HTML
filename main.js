// ========== PASSWORD OBFUSCATION ==========
const _codes=[21*5, 485-388, 218-109, 58*2, 13*8, 202-101, 49*2, 37*3, 230-115, 345/3];
const SECRET=_codes.map(c=>String.fromCharCode(c)).join('');

// ========== ELEMENT REFERENCES ==========
const boot=document.getElementById('boot'),
      login=document.getElementById('login'),
      adminLogin=document.getElementById('adminLogin'),
      adminPwdBox=document.getElementById('adminPwdBox'),
      desktopUI=document.getElementById('desktopUI'),
      adminDesktop=document.getElementById('adminDesktop');

// ========== BOOT -> LOGIN FLOW ==========
setTimeout(() => {
  document.getElementById('bootFill').style.width='100%';
  setTimeout(() => {
    boot.classList.remove('show');
    login.classList.add('show');
  }, 2000);
}, 200);

// ========== GUEST LOGIN HANDLER ==========
document.getElementById('guestCard').onclick = () => {
  // Remove boot, login, and terminal screens from DOM for performance
  boot && boot.parentNode && boot.parentNode.removeChild(boot);
  login && login.parentNode && login.parentNode.removeChild(login);
  const terminalEl = document.getElementById('terminal');
  terminalEl && terminalEl.parentNode && terminalEl.parentNode.removeChild(terminalEl);
  desktopUI.style.display = 'block';
  // Force fullscreen on desktop load
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
};

// ========== ADMIN LOGIN HANDLER ==========
document.getElementById('adminPwd').addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    if(e.target.value === SECRET) {
      // Remove boot, login, adminLogin, and terminal screens from DOM for performance
      boot && boot.parentNode && boot.parentNode.removeChild(boot);
      login && login.parentNode && login.parentNode.removeChild(login);
      adminLogin && adminLogin.parentNode && adminLogin.parentNode.removeChild(adminLogin);
      const terminalEl = document.getElementById('terminal');
      terminalEl && terminalEl.parentNode && terminalEl.parentNode.removeChild(terminalEl);
      adminDesktop.style.display = 'block';
      // Force fullscreen on admin desktop load
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else alert('Wrong password');
  }
});

// ========== TERMINAL SHORTCUT & COMMANDS ==========
const terminal=document.getElementById('terminal'),
      termInput=document.getElementById('termInput');

window.addEventListener('keydown', e => {
  if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    terminal.classList.add('show');
    termInput.value = '';
    termInput.focus();
  }
});

termInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    const input = termInput.value.trim().toLowerCase();
    if(input === 'sudo admin login') {
      terminal.classList.remove('show');
      login.classList.remove('show');
      adminLogin.classList.add('show');
      adminPwdBox.style.display = 'block';
      document.getElementById('adminPwd').focus();
    } else if(input === 'exit') {
      terminal.classList.remove('show');
    } else {
      alert('Unknown command');
    }
    termInput.value = '';
  }
});

// ========== CLOCK + APP DOCK SYSTEM ==========
document.addEventListener('DOMContentLoaded', () => {
  const clocks=document.querySelectorAll('.clock');
  const updateClock=()=>clocks.forEach(el=>
    el.textContent=new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
  );
  updateClock();
  setInterval(updateClock,60000);

  const apps = {
    daggerfall: {
      title:'Daggerfall',
      url:'https://archive.org/embed/msdos_Elder_Scrolls_The_-_Daggerfall_1996',
      icon:'https://cdn-icons-png.flaticon.com/512/181/181549.png'
    },
    youtube: {
      title:'YouTube',
      url:'https://www.youtube.com',
      icon:'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
    },
    files: {
      title:'File Manager',
      url:'https://example.com',
      icon:'https://cdn-icons-png.flaticon.com/512/148/148933.png'
    }
  };

  let daggerfallOpen = false;
  document.querySelectorAll('.dock').forEach(dock => {
    Object.keys(apps).forEach(key => {
      const cfg = apps[key];
      const icon = document.createElement('div');
      icon.className = 'dock-icon';
      icon.innerHTML = `<img src="${cfg.icon}">`;
      icon.onclick = () => {
        // Prevent multiple Daggerfall windows
        if (cfg.title === 'Daggerfall' && daggerfallOpen) {
          alert('Daggerfall is already open.');
          return;
        }
        // Daggerfall: run with js-dos in fullscreen overlay
        if (cfg.title === 'Daggerfall') {
          daggerfallOpen = true;
          const overlay = document.getElementById('jsdos-daggerfall');
          overlay.style.display = 'block';
          // Only initialize once per open
          if (!overlay._jsdosInstance) {
            Dos(document.getElementById('dosbox'), {
              wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
              bundleUrl: cfg.url
            }).then((ci) => {
              overlay._jsdosInstance = ci;
              // Request fullscreen for the overlay
              if (overlay.requestFullscreen) {
                overlay.requestFullscreen();
              } else if (overlay.webkitRequestFullscreen) {
                overlay.webkitRequestFullscreen();
              } else if (overlay.msRequestFullscreen) {
                overlay.msRequestFullscreen();
              }
            });
          } else {
            // If already initialized, just request fullscreen
            if (overlay.requestFullscreen) {
              overlay.requestFullscreen();
            } else if (overlay.webkitRequestFullscreen) {
              overlay.webkitRequestFullscreen();
            } else if (overlay.msRequestFullscreen) {
              overlay.msRequestFullscreen();
            }
          }
          // Close button
          document.getElementById('close-dosbox').onclick = () => {
            overlay.style.display = 'none';
            if (overlay._jsdosInstance) {
              overlay._jsdosInstance.exit();
              overlay._jsdosInstance = null;
            }
            daggerfallOpen = false;
            // Exit fullscreen if active
            if (document.fullscreenElement === overlay) {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
              } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
              }
            }
          };
          return;
        }
        // ...existing code for other apps...

        const [cls, min, max] = win.querySelectorAll('.w-btn');
        cls.onclick = () => {
          win.remove();
        };
        min.onclick = () => win.style.display = 'none';
        max.onclick = () => win.classList.toggle('fullscreen');

        const hdr = win.querySelector('.w-header');
        hdr.onpointerdown = evt => {
          // Only start drag if not clicking a button
          if (evt.target.closest('.w-btn')) return;
          evt.preventDefault();
          const ox = evt.clientX - win.offsetLeft;
          const oy = evt.clientY - win.offsetTop;
          hdr.setPointerCapture && hdr.setPointerCapture(evt.pointerId);
          const move = ev => {
            win.style.left = ev.clientX - ox + 'px';
            win.style.top = ev.clientY - oy + 'px';
          };
          const up = ev => {
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', up);
            hdr.releasePointerCapture && hdr.releasePointerCapture(evt.pointerId);
          };
          document.addEventListener('pointermove', move);
          document.addEventListener('pointerup', up);
        };
      };
      dock.appendChild(icon);
    });
  });
});
