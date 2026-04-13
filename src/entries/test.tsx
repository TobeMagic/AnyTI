import ReactDOM from 'react-dom/client';
import { TestPage } from '@/pages/TestPage';
import '@/styles.css';

const root = document.getElementById('app')!;
const slug = root.dataset.testSlug;

if (!slug) {
  throw new Error('Missing data-test-slug on test entry.');
}

ReactDOM.createRoot(root).render(<TestPage slug={slug} />);
