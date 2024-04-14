# Guia Básico de Comandos do Helm

Helm é um gerenciador de pacotes para Kubernetes. Ele permite aos usuários empacotar, configurar e implantar aplicações e serviços no Kubernetes de maneira simples e eficiente. Este documento cobre os comandos básicos necessários para começar a trabalhar com Helm.

## Instalação

Antes de começar, você precisa instalar o Helm no seu sistema. Para a maioria dos sistemas operacionais, você pode instalar o Helm com o seguinte comando:

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```


## Configuração Inicial
Verifique se o Helm está corretamente instalado e configurado:
```bash
helm version
```

## Trabalhando com repositórios
### Adicionar um repositório
```bash
helm repo add [nome] [URL]
```

## Listar repositórios
```bash
helm repo list
```

# Atualizar os repositórios
```bash
helm repo update
```


# Trabalhando com gráficos (charts)
## Procurar um gráfico
```bash
helm search repo [termo de pesquisa]
```
# Instalar um gráfico
```bash
    helm install [nome do lançamento] [nome do gráfico]
```

# Listar instalações
```bash
helm list
```

# Atualizar um gráfico
````bash
helm upgrade [nome do lançamento] [nome do gráfico]
````

# Desinstalar um gráfico
````bash
helm uninstall [nome do lançamento]
````

# Configuração e customização
## Visualizar valores de configuração de um gráfico
````bash
helm show values [nome do gráfico]
````

# Instalar um gráfico com valores customizados
````bash
helm install [nome do lançamento] [nome do gráfico] --values 
````

# Subindo projeto da NLW

```bash
helm upgrade --install nlwbackend ./deploy -n nlw-helm 
```