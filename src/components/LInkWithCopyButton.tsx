interface LinkWithCopyButtonProps {
    link: string;
}

export function LinkWithCopyButton({ link }: LinkWithCopyButtonProps) {

    return (
        <div>
            <input
                id="game_url"
                style={{
                    marginLeft: `${window.innerWidth / 2 - 290}px`,
                    marginTop: "30px",
                    width: "580px",
                    height: "30px",
                    fontFamily: "monospace",
                    borderRadius: "4px",
                    padding: "8px",
                    backgroundColor: "navy",
                    color: "whitesmoke",
                    resize: "none",
                }}
                onFocus={(event) => {
                    event.target.select();
                }}
                value={link}
                disabled
            />
        </div>
    );
}
