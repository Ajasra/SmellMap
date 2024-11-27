import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  const handleGoToIntro = () => {
    router.push('/chicago');
  };

  return (
    <div
      onClick={handleGoToIntro}
      style={{
        backgroundImage: 'url(/intro.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        cursor: 'pointer', // Add this line to change the cursor
      }}
    >
    </div>
  );
}