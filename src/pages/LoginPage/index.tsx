
// src/pages/Login/index.tsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLoginStore } from '../../stores/login.store';
import { useNavigate } from 'react-router-dom';
import {
  LoginPageContainer,
  Title,
  FormContainer,
  InputGroup, // Usando o wrapper
  StyledInput,
  StyledButton,
  MessageParagraph,
  LoadingSpinner // Importando o spinner
} from './styles';

// Definindo tipos para os campos do formulário para maior clareza
type FormFields = 'name' | 'surname' | 'email' | 'password';

const LoginPage: React.FC = observer(() => {
  const loginStore = useLoginStore();
  const navigate = useNavigate();

  // Estado local para UI (toggle, erros específicos de UI se necessário)
  const [isSignup, setIsSignup] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<FormFields, string>>>({});

  // Limpa erros ao trocar entre login/signup ou quando o store muda
  useEffect(() => {
    setLocalError(null);
    setValidationErrors({});
    // Opcional: resetar campos do store ao trocar? Depende do UX desejado.
    // loginStore.resetFields(); // Supondo que exista essa action no store
  }, [isSignup, loginStore]);

  // Limpa erro do store quando o usuário começa a digitar novamente
  useEffect(() => {
    if (loginStore.error) {
      // loginStore.clearError(); // Supondo que exista uma action para limpar o erro no store
    }
    if (localError) {
      setLocalError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginStore.email, loginStore.password]); // Limpa ao digitar email/senha


  // --- Validação Simples (Exemplo) ---
  const validateField = (name: FormFields, value: string): string | undefined => {
    if (!value) return 'This field is required.';
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email address.';
    if (name === 'password' && value.length < 6) return 'Password must be at least 6 characters.';
    // Adicione mais validações conforme necessário
    return undefined; // Sem erro
  };

  const validateForm = (isSignupForm: boolean): boolean => {
    const errors: Partial<Record<FormFields, string>> = {};
    let isValid = true;

    const fieldsToValidate: FormFields[] = isSignupForm
      ? ['name', 'surname', 'email', 'password']
      : ['email', 'password'];

    fieldsToValidate.forEach(field => {
      let value: string | undefined;
      // Busca o valor correto (do store ou do state local se usado)
      switch (field) {
        case 'email': value = loginStore.email; break;
        case 'password': value = loginStore.password; break;
        // Para signup, você pode querer usar state local ou adicionar name/surname ao store
        // Assumindo que name/surname são necessários apenas para o submit do signup
        // e não precisam estar no store globalmente para login.
        // Se precisar deles no store, ajuste aqui.
        // Aqui, pegamos do state local (requer adicionar state para name/surname)
        // OU diretamente do evento/submit (menos controlado)
        // VAMOS ASSUMIR que name/surname virão dos inputs gerenciados pelo handleSignup
        // Mas para validação *antes* do submit, precisaríamos de state ou ref.
        // Simplificação: Validação básica no submit ou adicionar state para name/surname
        // ---- Adicionando state local para name/surname para validação ----
        // (adicione useState para name/surname no topo do componente)
        // case 'name': value = name; break;
        // case 'surname': value = surname; break;
      }
      // A validação aqui fica complexa se misturar state local e store.
      // Idealmente: Tudo no store ou tudo em state local para o form.
      // VAMOS SIMPLIFICAR: Validação básica feita no submit handler.
      // Ou, assumir que os campos do store já estão validados pela digitação.
    });


    // Validação básica simplificada no momento do submit:
    if (!loginStore.email || validateField('email', loginStore.email)) {
      errors.email = validateField('email', loginStore.email) || 'Email is required.';
      isValid = false;
    }
    if (!loginStore.password || validateField('password', loginStore.password)) {
      errors.password = validateField('password', loginStore.password) || 'Password is required.';
      isValid = false;
    }

    if (isSignupForm) {
      const nameInput = document.getElementById('name') as HTMLInputElement | null;
      const surnameInput = document.getElementById('surname') as HTMLInputElement | null;
      const nameVal = nameInput?.value || '';
      const surnameVal = surnameInput?.value || '';

      if (!nameVal || validateField('name', nameVal)) {
        errors.name = validateField('name', nameVal) || 'Name is required.';
        isValid = false;
      }
      if (!surnameVal || validateField('surname', surnameVal)) {
        errors.surname = validateField('surname', surnameVal) || 'Surname is required.';
        isValid = false;
      }
    }


    setValidationErrors(errors);
    return isValid;
  };


  const handleLogin = async () => {
    setLocalError(null);
    setValidationErrors({});
    if (!validateForm(false)) return;

    const res = await loginStore.login(); // Assume que login usa store.email e store.password
    if (!res) {
      loginStore.setError( 'Login failed.');
      // Opcional: Mapear erro para campos específicos se a API retornar detalhes
      // Ex: if (res?.getError().includes('password')) setValidationErrors(prev => ({...prev, password: 'Password mismatch'}))
    } else {
      navigate('/boards');
    }
  };

  const handleSignup = async (name: string, surname: string) => {
    setLocalError(null);
    setValidationErrors({});
    if (!validateForm(true)) return;

    // Usar email/password do store, name/surname dos parâmetros
    await loginStore.signup({ name, surname, email: loginStore.email, password: loginStore.password });

    if (loginStore.token) {
      // Signup bem-sucedido, navega
      navigate('/boards');
    } else if (loginStore.error) {
      setLocalError(`Signup failed: ${loginStore.error}`);
      // Mapear erros de signup (ex: email já existe) se possível
      // if (loginStore.error.includes('email_exists')) setValidationErrors(prev => ({...prev, email: 'Email already in use.'}))
    } else {
      setLocalError('Signup failed: Unknown error occurred.');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null); // Limpa erros locais antes de tentar

    if (isSignup) {
      // Pega name/surname do formulário no momento do submit
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const surname = formData.get('surname') as string;
      handleSignup(name, surname);
    } else {
      handleLogin();
    }
  };

  const toggleFormMode = () => {
    setIsSignup(!isSignup);
    // Limpar campos e erros ao trocar
    loginStore.setEmail('');
    loginStore.setPassword('');
    setValidationErrors({});
    setLocalError(null);
    // if (loginStore.error) loginStore.clearError();
  }

  // Função auxiliar para verificar se há erro em um campo
  const hasError = (field: FormFields): boolean => !!validationErrors[field];
  // Função auxiliar para obter a mensagem de erro de um campo
  const getErrorMessage = (field: FormFields): string | undefined => validationErrors[field];

  return (
    <LoginPageContainer>
      <FormContainer onSubmit={handleSubmit} noValidate> {/* noValidate desabilita validação HTML5 */}
        <Title>{isSignup ? 'Create Account' : 'Sign In'}</Title>

        {isSignup && (
          <>
            <InputGroup>
              <label htmlFor="name">Name:</label>
              <StyledInput
                id="name"
                name="name" // Adicionar name para FormData funcionar
                type="text"
                placeholder="Enter your name"
                required
                aria-invalid={hasError('name')} // Para acessibilidade e estilo
                aria-describedby={hasError('name') ? "name-error" : undefined}
              // Opcional: Controlar valor com state local se precisar de validação em tempo real mais complexa
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              />
              {hasError('name') && <MessageParagraph id="name-error" $isError>{getErrorMessage('name')}</MessageParagraph>}
            </InputGroup>

            <InputGroup>
              <label htmlFor="surname">Surname:</label>
              <StyledInput
                id="surname"
                name="surname"
                type="text"
                placeholder="Enter your surname"
                required
                aria-invalid={hasError('surname')}
                aria-describedby={hasError('surname') ? "surname-error" : undefined}
              // Opcional: Controlar valor com state local
              // value={surname}
              // onChange={(e) => setSurname(e.target.value)}
              />
              {hasError('surname') && <MessageParagraph id="surname-error" $isError>{getErrorMessage('surname')}</MessageParagraph>}
            </InputGroup>
          </>
        )}

        <InputGroup>
          <label htmlFor="email">Email:</label>
          <StyledInput
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={loginStore.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              loginStore.setEmail(e.target.value);
              // Limpa o erro específico deste campo ao digitar
              if (validationErrors.email) {
                setValidationErrors(prev => ({ ...prev, email: undefined }));
              }
            }}
            required
            aria-invalid={hasError('email')}
            aria-describedby={hasError('email') ? "email-error" : undefined}
          // Adiciona a classe 'error' condicionalmente se CommonInput não suportar aria-invalid para estilo
          // className={hasError('email') ? 'error' : ''}
          />
          {hasError('email') && <MessageParagraph id="email-error" $isError>{getErrorMessage('email')}</MessageParagraph>}
        </InputGroup>

        <InputGroup>
          <label htmlFor="password">Password:</label>
          <StyledInput
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={loginStore.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              loginStore.setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors(prev => ({ ...prev, password: undefined }));
              }
            }}
            required
            aria-invalid={hasError('password')}
            aria-describedby={hasError('password') ? "password-error" : undefined}
          // className={hasError('password') ? 'error' : ''}
          />
          {hasError('password') && <MessageParagraph id="password-error" $isError>{getErrorMessage('password')}</MessageParagraph>}
        </InputGroup>

        {/* Mensagem de erro geral (API ou local) */}
        {localError && <MessageParagraph $isError>{localError}</MessageParagraph>}
        {/* Mensagem de erro do Store (se não for tratada como localError) */}
        {loginStore.error && !localError && <MessageParagraph $isError>{loginStore.error}</MessageParagraph>}

        {/* Indicador de Loading */}
        {loginStore.isLoading && <LoadingSpinner aria-label="Loading..." />}

        <StyledButton type="submit" disabled={loginStore.isLoading}>
          {loginStore.isLoading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
        </StyledButton>

        <StyledButton type="button" variant="secondary" onClick={toggleFormMode} disabled={loginStore.isLoading}>
          {isSignup ? 'Already have an account? Login' : 'Create an account'}
        </StyledButton>

      </FormContainer>
    </LoginPageContainer>
  );
});

export default LoginPage;
