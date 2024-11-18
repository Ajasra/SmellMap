import { Button, Group } from "@mantine/core";
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  const handleGoToIntro = () => {
    router.push('/chicago');
  };

  return (
    <Group mt={50} justify="center">
      <Button size="xl" onClick={handleGoToIntro}>Welcome to Mantine!</Button>
    </Group>
  );
}