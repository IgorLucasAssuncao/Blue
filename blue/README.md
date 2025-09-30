# Blue - Bluetooth manager (demo)

Este projeto adiciona um exemplo de gerenciador de conexões Bluetooth com:

- Contexto para armazenar conexões reutilizáveis
- Mock de descoberta/scan
- Persistência via AsyncStorage
- UI com menu inferior e telas: Descobrir, Salvas, Editar, Config

Como usar

1. Instale dependências (Expo):

```powershell
cd c:\Users\igorl\OneDrive\Documentos\Blue\blue
npm install
# ou
# expo install @react-native-async-storage/async-storage
# npm install uuid
```

2. Rode com Expo:

```powershell
npm start
```

Observações

- O serviço de Bluetooth é mock; substitua `src/services/bluetoothService.ts` por uma implementação real (react-native-ble-plx, expo-bluetooth, etc.) quando necessário.
- AsyncStorage precisa ser instalado: `expo install @react-native-async-storage/async-storage`.

Como habilitar Bluetooth real (opcional)

1. Biblioteca recomendada: `react-native-ble-plx` (funciona em projetos bare ou Expo com prebuild)

Com npm:

```powershell
cd c:\Users\igorl\OneDrive\Documentos\Blue\blue
npm install react-native-ble-plx
```

Se estiver usando Expo Managed workflow, você precisará rodar `expo prebuild` ou usar EAS Build para gerar os binaries nativos e instalar a dependência nativa:

```powershell
# gerar arquivos nativos
expo prebuild
# ou use EAS
eas build --platform android
```

2. Permissões necessárias

- Android (AndroidManifest.xml): ACCESS_FINE_LOCATION ou BLUETOOTH_SCAN/BLUETOOTH_CONNECT (Android 12+)
- iOS (Info.plist): NSBluetoothAlwaysUsageDescription e NSBluetoothPeripheralUsageDescription

3. Alternativa Expo-only

Se não quiser usar módulos nativos, procure por um módulo compatível com Expo (podem existir limitações). O código em `src/services/bluetoothService.ts` já faz fallback para um mock caso `react-native-ble-plx` não esteja disponível.
