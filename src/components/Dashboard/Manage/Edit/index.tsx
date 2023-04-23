import { useCallback, useEffect, useState } from "react";
import {
  Navbar,
  Title,
  Image,
  Wrapper,
  Description,
  Container,
  BackArrow,
  EditButton,
  Row,
  Save,
  Close,
  DescriptionInput,
  NameInput,
  Alert,
  AlertInput,
} from "./style";
import { TopicEdit } from "./Topic";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { EditImageModal } from "./EditImageModal";

interface EditInterface {
  id: string;
}

export function Edit(props: EditInterface) {
  const [cookies, setCookie] = useCookies(["Authorization"]);
  const token = cookies.Authorization;
  const id = token.user.id;

  const router = useRouter();
  const [data, setData] = useState<any>();
  const [topics, setTopics] = useState<any>();
  const [isName, setIsName] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [alert, setAlert] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [newAlert, setNewAlert] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const updateName = useCallback(async () => {
    const data = await fetch(`/api/courses/updateCourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.id,
        value: name,
        type: "name",
      }),
    });

    if (data.status === 200) {
      setIsName(false);
      setNewName(name);
    }
  }, [name, props.id]);

  const updateAlert = useCallback(async () => {
    const data = await fetch(`/api/courses/updateCourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.id,
        value: alert,
        type: "alert",
      }),
    });

    if (data.status === 200) {
      setIsAlert(false);
      setNewAlert(alert);
    }
  }, [alert, props.id]);

  const updateDescription = useCallback(async () => {
    const data = await fetch(`/api/courses/updateCourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.id,
        value: description,
        type: "description",
      }),
    });

    if (data.status === 200) {
      setIsDescription(false);
      setNewDescription(description);
    }
  }, [description, props.id]);

  const getCourseData = useCallback(async () => {
    const data = await fetch(`/api/courses/myCreatedCoursesTopics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.id,
        creator: id,
      }),
    });

    if (data.status === 500) {
      router.push("/dashboard/manage");
    }

    const response = await data.json();

    console.log(response);

    setData(response.data);
    setTopics(response.topics);
    setName(response.data?.[0].name);
    setDescription(response.data?.[0].description);
    setAlert(response.data?.[0].alert);
    setImage(response.imageUrl);
  }, [id, props.id, router]);

  const handleKeyDown = useCallback(
    (e: string, type: string) => {
      if (e === "Enter") {
        if (type === "name") updateName();
        if (type === "description") updateDescription();
        if (type === "alert") updateAlert();
      }
    },
    [updateAlert, updateDescription, updateName]
  );

  useEffect(() => {
    getCourseData();
  }, [getCourseData]);

  return (
    <>
      <Navbar>
        <BackArrow
          onClick={() => {
            window.history.back();
          }}
        />
        <Image
          style={{
            backgroundImage: image ? `url(${image})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={handleShow}
        />
        <Wrapper>
          {isName ? (
            <Row>
              <NameInput
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e.key, "name");
                }}
              />
              <Save
                onClick={() => {
                  updateName();
                }}
              />
              <Close
                onClick={() => {
                  setIsName(false);
                }}
              />
            </Row>
          ) : (
            <Row>
              <Title>{newName === "" ? data?.[0].name : newName}</Title>
              <EditButton
                onClick={() => {
                  setIsName(true);
                }}
              />
            </Row>
          )}

          {isDescription ? (
            <Row>
              <DescriptionInput
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e.key, "description");
                }}
              />
              <Save
                onClick={() => {
                  updateDescription();
                }}
              />
              <Close
                onClick={() => {
                  setIsDescription(false);
                }}
              />
            </Row>
          ) : (
            <Row>
              <Description>
                {newDescription === "" ? data?.[0].description : newDescription}
              </Description>
              <EditButton
                onClick={() => {
                  setIsDescription(true);
                }}
              />
            </Row>
          )}
        </Wrapper>
      </Navbar>
      <Container>
        {isAlert ? (
          <Alert>
            <AlertInput
              type="text"
              value={alert}
              onChange={(e) => {
                setAlert(e.target.value);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e.key, "alert");
              }}
            />
            <Save
              onClick={() => {
                updateAlert();
              }}
            />
            <Close
              onClick={() => {
                setIsAlert(false);
              }}
            />
          </Alert>
        ) : (
          <Alert>
            {newAlert === "" ? alert : newAlert}
            <EditButton
              onClick={() => {
                setIsAlert(true);
              }}
            />
          </Alert>
        )}

        {topics?.map((item: any) => {
          return (
            <TopicEdit
              key={item.id}
              topic={item.topic}
              id={item.id}
              lesson={item.lesson}
            />
          );
        })}
      </Container>
      <EditImageModal
        visible={show}
        hide={handleClose}
        imageUrl={image}
        courseId={props.id}
      />
    </>
  );
}
