import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Providers } from './providers/QueryClientProvider.tsx'

import './index.scss'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Providers>
			<App />
		</Providers>
	</StrictMode>,
)
