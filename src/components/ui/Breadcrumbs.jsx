import { Breadcrumb } from "@chakra-ui/react";

const Breadcrumbs = ({ pathSegments }) => {
  return (


    <Breadcrumb.Root mt={2} ml={2}>
      <Breadcrumb.List alignContent="center">
      <>
      <Breadcrumb.Item color="gray.100">
        <Breadcrumb.Link href="#"
        color="gray.200"
        fontSize="sm"
        fontWeight="medium">
          Home
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator mt="3px"/>
      </>
      {pathSegments.map(({ label, href }, idx) => (
        <>
        <Breadcrumb.Item color="gray.100">
        <Breadcrumb.Link 
        href={href}
        color="gray.200"
        fontSize="sm"
        fontWeight="medium">
          {label}
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator mt="3px"/></>
      ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};

export default Breadcrumbs;