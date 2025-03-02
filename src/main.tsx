import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.scss'
import { Providers } from './providers/QueryClientProvider'
import App from './App'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Providers>
			<App />
		</Providers>
	</StrictMode>,
)
