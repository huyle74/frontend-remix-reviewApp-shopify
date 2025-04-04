export default function ReviewsPhotos({ photos, onClick }) {
  const checkLength = photos.length > 2;
  const images = checkLength ? photos.slice(0, 2) : photos;
  const lastPhoto = (
    <div
      style={{
        margin: "0 0.2rem 0 0.2rem",
        width: "3rem",
        position: "relative",
        height: "4rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgb(0, 0, 0, 0.5)",
          zIndex: 1000,
          fontSize: "20px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +{photos.length - 2}
      </div>
      <img
        src={photos[2]}
        alt="last photo"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          borderRadius: "5%",
        }}
      />
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center" }} onClick={onClick}>
      {images.map((photo, index) => {
        return (
          <div
            key={`${index}-${photo}`}
            style={{
              margin: "0 0.2rem 0 0.2rem",
              width: "3rem",
              height: "4rem",
            }}
          >
            <img
              src={photo}
              alt="review photo"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "5%",
              }}
            />
          </div>
        );
      })}
      {checkLength && lastPhoto}
    </div>
  );
}
