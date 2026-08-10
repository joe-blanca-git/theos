# Regras de Interface (UI/UX)
- NUNCA use `alert()`, `prompt()` ou `confirm()` nativos do navegador. SEMPRE utilize os componentes visuais padronizados do projeto (Toast, Modais em HTML/CSS) para exibir avisos ou pedir confirmações.
- **Padrão Absoluto de Modais**: TODO NOVO MODAL ou edição deve seguir estritamente o layout premium (como em "cursos"):
  1. **Modais de Ação**:
     - `modal-content rounded-4 border-0 shadow-lg d-flex flex-column`
     - Header: `modal-header bg-dark border-bottom-0 pb-3 pt-4 px-4 rounded-top-4 position-relative overflow-hidden flex-shrink-0`
     - Background Icon (Header): `<div class="position-absolute top-0 end-0 p-3 opacity-25"> <i class="fas fa-[icon] text-white" style="font-size: 8rem; transform: translate(20%, -30%);"></i> </div>`
     - Título: Wrapper `<div class="d-flex align-items-center gap-3">`, ícone em `bg-[cor] bg-opacity-10 text-[cor] rounded-circle`, e `<h5 class="modal-title fw-bolder text-white mb-0 fs-5">`.
     - Botão Fechar: `<button type="button" class="btn-close position-absolute top-0 end-0 mt-4 me-4" data-bs-dismiss="modal"></button>`.
     - Body: Para ações e formulários: `bg-secondary bg-opacity-10 p-4`, agrupando os inputs dentro de `<div class="card border-0 shadow-sm rounded-4 mb-4"><div class="card-body p-4">`.
     - Footer: `modal-footer bg-secondary bg-opacity-10 border-top-0 px-4 py-3 d-flex justify-content-between align-items-center` (Botão cancelar branco/light e botão de ação primary com ícone).
  2. **Modais de Confirmação**:
     - Header: Idêntico ao de ação (bg-dark, ícone bg).
     - Body: `<div class="modal-body text-center py-4 bg-light">`.
     - Ícone centralizado: `<div class="d-inline-flex align-items-center justify-content-center bg-[cor] bg-opacity-10 rounded-circle text-[cor]" style="width: 80px; height: 80px;"><i class="fas fa-[icon] fs-1"></i></div>`.
     - Textos: `<h5 class="fw-bold mb-2">` e `<p class="text-muted mb-0">`.
     - Footer: `modal-footer bg-light border-top-0 px-4 py-3 d-flex justify-content-center gap-2 rounded-bottom-4`.
- **Botões Padrão**: Sempre usar `rounded-pill` e `fw-semibold` (ou `fw-bold` para actions primárias). Botão cancelar deve ser `btn-light text-secondary border`.
- **Estado de Carregamento (Loading)**: NUNCA use `spinner-border` puro ou textos como "Carregando..." para tabelas, grids ou blocos de conteúdo. SEMPRE utilize o padrão **Skeleton Loader**.
  - O layout deve usar `<div class="skeleton rounded"></div>` ou `<div class="skeleton rounded-pill"></div>`, combinados com as classes utilitárias de tamanho (ex: `w-100`, `style="height: 16px;"`).
  - Para tabelas, use `*ngFor` num array dummy (ex: `[1,2,3,4]`) dentro de um `<ng-container *ngIf="isLoading">` e recrie as colunas com esqueletos correspondentes aos dados que irão carregar.
