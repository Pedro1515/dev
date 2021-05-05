import classNames from "classnames";

export interface MemberProps {
  name: string;
  index: number;
}

export interface MembersProps {
  members: string[];
}

export function Member({ name, index }: MemberProps) {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  return (
    <img
      className={classNames(
        "inline-block",
        "h-8 w-8",
        "rounded-full",
        "text-white",
        "shadow-solid",
        { "-ml-2": index !== 0 }
      )}
      src={`https://ui-avatars.com/api/?name=${name}&background=${randomColor}&color=fff&bold=true`}
      alt={name}
      title={name}
    />
  );
}

export function Members({ members }: MembersProps) {
  return (
    <div className="flex overflow-hidden">
      {!members
        ? "-"
        : members.map((name, index) => (
            <Member key={name} {...{ name, index }} />
          ))}
    </div>
  );
}
